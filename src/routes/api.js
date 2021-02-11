
module.exports = app => {

  app.post('/search', (req, res) => {

    return res.status(200).json({
      success: true,
      search: true
    })

  })

  app.get('/admin', (req, res) => {

    return res.status(200).json({
      success: false,
      admin: true
    })

  })

}