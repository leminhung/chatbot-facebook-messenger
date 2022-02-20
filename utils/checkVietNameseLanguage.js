const regex =
  /[àảãáạăằẳẵắặâầẩẫấậđèẻẽéẹêềểễếệìỉĩíịjòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵ]/;
const checkVietnameseString = (string) => {
  return regex.test(string);
};

export { checkVietnameseString };
