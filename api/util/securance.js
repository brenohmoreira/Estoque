const crypto = require("crypto")

module.exports = {
  encryptData: (password) => {
    return crypto.createHash("sha256").update(password).digest("hex")
  }
}