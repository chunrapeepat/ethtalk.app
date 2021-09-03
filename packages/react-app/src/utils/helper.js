import md5 from "md5";

export const hashURL = url => {
  return md5(url);
};
