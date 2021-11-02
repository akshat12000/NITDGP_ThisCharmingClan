const express = require('express')
const Article = require('./../models/article')
const router = express.Router()

router.get('/new', (req, res) => {
  res.render('articles/new', { article: new Article() })
})

router.get('/edit/:id', async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render('articles/edit', { article: article })
})

router.get('/:slug', async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article,curUser:req.session.user._id })
})
router.get('/:id', async (req, res) => {
  const article = await Article.findOne(req.params.id)
  console.log(article);
  if (article == null) res.redirect('/')
  res.render('articles/show', { article: article,curUser:req.session.user._id })
})


router.post('/', async (req, res) => {
  req.article = new Article()


  let article = req.article
  article.userId = req.session.user._id;
  article.title = req.body.title
  article.name = req.body.name
  article.description = req.body.description
  article.markdown = req.body.markdown
  try {
    article = await article.save()
    res.redirect(`/articles/${article.slug}`)
  } catch (e) {
    console.log(e);
    res.render(`articles/new`, { article: article })
  }

})

router.post('/upvote/:id',async(req,res)=>{
 var article = await Article.findById(req.params.id)
 var curUser=req.session.user._id;
 var upUsers= article.votedUsers;
  
  if(upUsers.indexOf(curUser)==-1){
    article.voteCount+=1;
    article.votedUsers.push(curUser);
    await article.save();
  }

  res.redirect(`/articles/${article.slug}`);

})



router.put('/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  
  next()
}, saveArticleAndRedirect('edit'))

router.delete('/:id', async (req, res) => {
  await Article.findByIdAndDelete(req.params.id)
  res.redirect('/blog')
})

function saveArticleAndRedirect(path) {
  return async (req, res) => {
    
    let article = req.article
    article.title = req.body.title
    article.name = req.body.name 
    article.description = req.body.description
    article.markdown = req.body.markdown
    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (e) {
      console.log(e);
      res.render(`articles/${path}`, { article: article })
    }
  }
}

module.exports = router