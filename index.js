const express = require("express");
const app = express();

// pour le body
app.use(express.json());

app.use(
  function debug(_req, _res, next) {
    console.log("Request received");
    next();
  }
)

// app.use(express.json(), debug)

function transformName(req, _res, next) {
  if (req.body.name) {
    req.body.name = req.body.name.toLowerCase()
  }
  next()
}

function protect() {
  // verifier si l'utisateur est connecte
  return res.status(201).send("Login first")
}


function findHero(req, _res, next) {
  const hero = superHeros.find((hero) => {
    return hero.name.toLowerCase().replace(" ", "-") === req.params.name.toLowerCase().replace(" ", "-")
  });
  req.hero = hero;
  next();
}

const superHeros = [
  {
    name: "Iron Man",
    power: ["money"],
    color: "red",
    isAlive: true,
    age: 46,
    image:
      "https://blog.fr.playstation.com/tachyon/sites/10/2019/07/unnamed-file-18.jpg?resize=1088,500&crop_strategy=smart",
  },
  {
    name: "Thor",
    power: ["electricity", "worthy"],
    color: "blue",
    isAlive: true,
    age: 300,
    image:
      "https://www.bdfugue.com/media/catalog/product/cache/1/image/400x/17f82f742ffe127f42dca9de82fb58b1/9/7/9782809465761_1_75.jpg",
  },
  {
    name: "Daredevil",
    power: ["blind"],
    color: "red",
    isAlive: false,
    age: 30,
    image:
      "https://aws.vdkimg.com/film/2/5/1/1/251170_backdrop_scale_1280xauto.jpg",
  },
];

app.get("/", (_req, res) => {
  res.send("Hero API");
});

//  /heroes
app.get("/heroes", (_req, res) => {
  res.send(superHeros);
});

// /heroes/:name
app.get("/heroes/:name", (req, res) => {
  const hero = superHeros.find((hero) => {
    return (
      // Iron Man -> iron man -> iron-man
        hero.name.toLowerCase().replace(" ", "-") === req.params.name.toLowerCase().replace(" ", "-")
    )
  });

  res.json(hero);

  if (!hero) {
    res.send({
      message: " This hero is not exist",
    });
  }
});
//Test: Iron Man => Iron-Man or Iron%20Man


// /heroes/:name/powers
app.get("/heroes/:name/powers", findHero, (req, res) => {
    // const hero = superHeros.find((hero) => {
    //     return (
    //       hero.name.toLowerCase().replace(" ", "-") === req.params.name.toLowerCase().replace(" ", "-")
    //     ) 
    //   });
    
      res.json(req.hero.power);
});

// /heroes POST "Ok, héros ajouté" 
// transformName body
app.post("/heroes", protect, transformName, (req, res) => {
  superHeros.push(req.body);

  res.status(201).json({
    message: "Ok, hero ajouté",
    superHeros,
  });
});


// /heroes/:name/powers PATCH "Pouvoir ajouté !"
app.patch("/heroes:name/powers", findHero, (req, res) => {
  const hero = req.hero;
  // const hero = superHeros.find((hero) => {
  //     return (
  //       hero.name.toLowerCase().replace(" ", "-") === req.params.name.toLowerCase().replace(" ", "-")
  //     )
  // });

  hero.power.push(req.body.power);

  res.json({
    message: "Power added",
    hero,
  });
})

app.get("*", (req, res) => {
  res.status(404).send("Not found");
});

// Start server
app.listen(8000, () => console.log("Listening..."));
