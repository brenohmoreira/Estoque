module.exports = {
  sendRespost: (res, status, message = '', data = null) => {
    return res.status(status).json({ status: status, data: data, message: message})
  }
}