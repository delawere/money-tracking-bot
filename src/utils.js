const setParams = (urlString, params) => {
  const url = new URL(urlString);
  Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));

  return url;
};

module.exports = setParams;
