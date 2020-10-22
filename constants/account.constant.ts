import { Rule } from '../constants/app.type';

export const regexPassword: RegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
export const max255Char: Rule = { max: 255, message: 'Vui lòng chỉ nhập không quá 255 ký tự', trigger: 'blur' };
