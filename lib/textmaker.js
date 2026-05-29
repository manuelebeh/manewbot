const cheerio = require("cheerio");
const fetch = (...args) => import("node-fetch").then(({
  default: fetchFn
}) => fetchFn(...args));
const FormData = require("form-data");
const cookie = require("cookie");
const textmaker = async (pageUrl, textLines, radioOption = "") => {
  textLines = textLines.split(";");
  const pageResponse = await fetch(pageUrl, {
    method: "GET",
    headers: {
      "User-Agent": "GoogleBot"
    }
  });
  const pageHtml = await pageResponse.text();
  const parsedCookies = pageResponse.headers.get("set-cookie").split(",").map(cookie.parse).reduce((acc, parsed) => ({
    ...acc,
    ...parsed
  }), {});
  const cookieHeader = Object.entries({
    __cfduid: parsedCookies.__cfduid,
    PHPSESSID: parsedCookies.PHPSESSID
  }).map(([name, value]) => cookie.serialize(name, value)).join("; ");
  const $page = cheerio.load(pageHtml);
  const token = $page("input[name=\"token\"]").attr("value");
  const buildServer = $page("input[name=\"build_server\"]").attr("value");
  const buildServerId = $page("input[name=\"build_server_id\"]").attr("value");
  const radioOptions = $page("input[name^='radio0[radio]']").map((_, el) => $page(el).val()).get();
  if (radioOptions.length > 0 && !radioOption) {
    const randomIndex = Math.floor(Math.random() * radioOptions.length);
    radioOption = radioOptions[randomIndex];
    console.log("Option radio sélectionnée aléatoirement : " + radioOption);
  }
  const submitForm = new FormData();
  textLines.forEach(line => submitForm.append("text[]", line.trim()));
  submitForm.append("submit", "Go");
  if (radioOption) {
    submitForm.append("radio0[radio]", radioOption);
  }
  submitForm.append("token", token);
  submitForm.append("build_server", buildServer);
  submitForm.append("build_server_id", buildServerId);
  const submitResponse = await fetch(pageUrl, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: cookieHeader,
      ...submitForm.getHeaders()
    },
    body: submitForm.getBuffer()
  });
  const submitHtml = await submitResponse.text();
  const $submit = cheerio.load(submitHtml);
  const formValueRaw = pageUrl.includes("en.ephoto360.com") ? $submit("input[name=\"form_value_input\"]").attr("value") : $submit("#form_value").first().text();
  if (!formValueRaw) {
    return {
      status: false
    };
  }
  const formValue = JSON.parse(formValueRaw);
  const createForm = new FormData();
  createForm.append("id", formValue.id);
  formValue.text.forEach(text => createForm.append("text[]", text));
  createForm.append("token", formValue.token);
  createForm.append("build_server", formValue.build_server);
  createForm.append("build_server_id", formValue.build_server_id);
  if (formValue.radio0) {
    createForm.append("radio0[radio]", formValue.radio0.radio);
  }
  const createResponse = await fetch(pageUrl.split("/").slice(0, 3).join("/") + "/effect/create-image", {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "User-Agent": "GoogleBot",
      Cookie: cookieHeader,
      ...createForm.getHeaders()
    },
    body: createForm.getBuffer()
  });
  const createResult = await createResponse.json();
  if (!createResult.image) {
    throw new Error("textmaker: Erreur lors de la génération de l'image");
  }
  return {
    status: createResult.success,
    url: "" + buildServer + createResult.image
  };
};
module.exports = textmaker;
