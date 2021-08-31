const mainController = {
    index: (req, res) => {
        res.render('index');
   },
    aboutUs: (req, res) => {
        res.render('about-us');
    },
    contact: (req, res) => {
        res.render('contact');
    },
    suscribe: (req, res) => {
        res.render('suscribe');
   },
    service: (req, res) => {
        res.render('service');
    },
    privacy: (req, res) => {
        res.render('privacy');
    },
    help: (req, res) => {
        res.render('help');
    }
}

module.exports = mainController;