class RegexValid {
  capitalizeName(name) {
    return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  validatePassword(password) {
    if (password.length >= 8 && password.length <= 18) return true;
    else return false;
  }

  validateConfirmPassword(password, confirm_password) {
    if (password == confirm_password) return true;
    else return false;
  }

  validateEnrollment(enrollment) {
    const re = /^([\d]{8})$/gm;
    return re.test(enrollment);
  }

  validateName(name) {
    const re =
      /^([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ']{3,}){1}(([',. -][a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ' ]{3,45}))$/gm;
    return re.test(name);
  }
}

module.exports = new RegexValid();
