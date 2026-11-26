  const {nanoid} = require('nanoid');
  const URL = require('../models/url');


  async function handleGenerateNewShortUrl(req, res) {
    const body = req.body ;
    if(!body.url) return res.status(400).json({error: "url is required"});
    const shortId = nanoid(8);
   
    await URL.create({
      shortUrl: shortId,
      redirectUrl: body.url,
      visitsHistory: [],
      createdBy: req.user._id
    });
    
    return res.render('home', {
      id : shortId,
      urls : await URL.find({createdBy: req.user._id})
  });
  }

  async  function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const results = await URL.findOne({ shortUrl: shortId });

    return res.json({ totalVisits: results.visitsHistory.length, visitsHistory: results.visitsHistory });
  }

  module.exports = {
    handleGenerateNewShortUrl,
    handleGetAnalytics
  };