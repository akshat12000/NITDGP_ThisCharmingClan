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
    required: [true, "Patient's name required"]
},
contact: {
    type: String,
},
date: {
    type: Date,
    required: [true, "Date of appointment required"]
},
time: {
    type: String,
    required: [true, "Time of appointment required"]
},
symptoms: {
    type: String,
},
status: {
    type: String,
    required: true
},
  meetLink: {
      type: String,
  },
  patientId: {
      type: String
  },
  doctorId: {
      type: String
  }
});

var Appointment = mongoose.model("Appointment", appointmentSchema);

app.get("/appointment_form", (req, res) => {
  res.render("doctor/appointment_form");
});

app.get("/appointment_form/status", (req, res) => {
  const curUser=req.session.user._id;
  Appointment.find({'patientId':curUser}, (err, appointments) => {
    res.render('doctor/status',{appointments:appointments});
    })
  }
        );

        app.post("/appointment_form", (req, res) => {
          const appointment = new Appointment({
              name: req.body.Name,
              contact: req.body.Contact,
              date: req.body.Date,
              time: req.body.Time,
              symptoms: req.body.Symptoms,
              status: "notAssigned",
              patientId:req.session.user._id
          });
          appointment.save((err) => {
              if (!err) {
                  res.redirect("/appointment_form/status");
              } else {
                  console.log(err);
              }
          });
      });

      app.post("/delete", (req, res) => {
        const currentId = req.body.delbtn;
        
        Appointment.findByIdAndRemove(currentId, function(err) {
            if (!err) {
                console.log("Item Deleted Successfully!");
                res.redirect("/appointment_form");
            }
        });
    
    });

      app.get("/doctor_portal", async (req, res) => {
        
        var doctors=await Doctor.find({},'_id');
        var curUser=req.session.user._id;
        if(doctors.indexOf(curUser)==-1){
            res.send("You don't have the permission to access the site")
        }
        else
        {
          Appointment.find({ }, (err, appointments) => {
            res.render('doctor/doctor',{appointments:appointments,curUser:curUser});
            })
        }
 
                    
        
    });  

    app.post("/confirm", (req, res) => {
      const docId=req.session.user._id;
      const appointmentId=req.body.cnf;
      Appointment.updateOne({_id:appointmentId},{meetLink: "https://meet.jit.si/" + appointmentId,status: "assigned",doctorId:docId}, function (err,app){
        if(err)
        {
          console.log(err)
        }
      });
           res.redirect("/doctor_portal");
  });
  app.post("/complete", (req, res) => {
    const docId=req.session.user._id;
    const appointmentId=req.body.cnf;
    Appointment.updateOne({_id:appointmentId},{status: "completed"}, function (err,app){
      if(err)
      {
        console.log(err)
      }
    });
         res.redirect("/doctor_portal");
});

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
  