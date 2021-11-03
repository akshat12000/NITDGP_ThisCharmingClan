const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const Article = require('./models/article')
const articleRouter = require('./routes/articles')
const methodOverride = require('method-override')
const errorController = require('./controllers/error');
const User = require('./models/user');
const Doctor = require('./models/doctor');

const MONGODB_URI =
  'mongodb+srv://myntrahackathon:myntrahackathon@cluster0.vgomr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const dauthRoutes = require('./routes/dauth');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

const appointmentSchema = new mongoose.Schema({
  name: {
      type: String,
      required: [true, "Doctor's name required"]
  },
  qualifications: {
      type: String
  },
  meetLink: {
      type: String,
  },
  patientId: {
      type: String
  }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);



app.get('/blog', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})
app.use('/articles', articleRouter)


app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});



app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(dauthRoutes);
app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true ,useUnifiedTopology: true })
  .then(result => {
  
  
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
  