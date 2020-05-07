export default{
  verifyTell(tell) {
    // const rule = /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
    const rule = /^((13|15|18)\d{9})|(14[57]|17[0678]\d{8})$/;
    return rule.test(tell);
  },
};
