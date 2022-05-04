const express = require('express');
const app = express();
const path = require('path');
const dirPath = path.join(__dirname, '/../views');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const mongoose = require('mongoose');
const DashboardController = require('../Routes/DashboardController');
const FacturesController = require('../Routes/FacturesController');

const accueil = "home";

const { Eleve, Activite, Facture, Famille, ListActivite} = require('../Models/Model');

// set the view engine to ejs
app.set('view engine', 'ejs');


const middlewares = [
  // ...
  bodyParser.urlencoded({ extended: true })
];
app.use(middlewares);
app.use('/dashboard', DashboardController);
app.use('/facture', FacturesController);

require('../Models/dbConfig');

app.use('/ressources', express.static('ressources'));

app.get('/home', async (req,res) => {
    //Génération automatique des factures du mois
    var createFact = false;
    var creationListActivite = false;
    var countFact = -1;
    var countListActivite = -1;
    var moisActuel = new Date().getMonth();
    var anneeActuel = new Date().getFullYear();
    var activiteListe = [];
    var activiteQteeListe = [];

    var c=0;

    const queryZ = await ListActivite.find(({mois : moisActuel, annee : anneeActuel}),(err, listActivites) => {
        if(!err){
            countListActivite = listActivites.length;
            console.log("countListActivite " + countListActivite);
            if(countListActivite <= 0){
                creationListActivite = true;
            }
        }
    }).exec();

    if (moisActuel === 6 || moisActuel === 7) creationListActivite = false;

    console.log("creationListActivite " + creationListActivite);
    if (creationListActivite){
        const query1 = await Activite.findOne({description: "Cantine"}, (err, acti) => {
            if (!err) {
                console.log(acti.description);
                activiteListe.push(acti);
                activiteQteeListe.push(16);
            } else console.log("erreur cantine");
        }).exec();

        const query2 = await Activite.findOne({description: "Periscolaire"}, (err, acti) => {
            if (!err) {
                console.log(acti.description);
                activiteListe.push(acti);
                activiteQteeListe.push(10);
            } else console.log("erreur peri");
        }).exec();

        const query3 = await Activite.findOne({description: "Mensualite"}, (err, acti) => {
            if (!err) {
                console.log(acti.description);
                activiteListe.push(acti);
                activiteQteeListe.push(1);
            } else console.log("erreur peri");
        }).exec();

        if (moisActuel === 8){
            const query4 = await Activite.findOne({description: "Inscription"}, (err, acti) => {
                if (!err) {
                    scolarite = acti;
                    console.log(acti.description);
                    activiteListe.push(acti);
                    activiteQteeListe.push(1);
                } else console.log("erreur peri");
            }).exec();
        }
        await Eleve.find((err, eleves) => {
            if (!err) {
                eleves.forEach(element => {
                    const newListActivite = new ListActivite({
                        eleve: element,
                        activite: activiteListe,
                        activiteQte : activiteQteeListe,
                        mois: moisActuel,
                        annee: new Date().getFullYear()
                    }).save((err) => {
                        if (err) {
                            console.log('Erreur création nouvelles données :' + err);
                        }else {
                            c++;
                            console.log('OKKKK ' + c);
                        }
                    });
                })
            }
            else console.log("Error to get data : " + err);
        });
    }
    await console.log("c "+ c);

    if (creationListActivite) await new Promise(resolve => setTimeout(resolve, 5000));
    const query = await Facture.find(({ annee : anneeActuel }),(err, factures) => {
        if(!err){
            countFact = factures.length;
            console.log("countFact "+ countFact);
        }
    }).exec();

    const queryY = await Facture.find(({mois : moisActuel, annee : anneeActuel}),(err, factures) => {
        if(!err){
            let factMois = factures.length;
            console.log("countFact "+ factMois);
            if(factMois <= 0){
                createFact = true;
            }
        }
    }).exec();

    if (moisActuel === 6 || moisActuel === 7) createFact = false;

    console.log("createFact " + createFact);
    if(createFact){
        await Famille.find(async (err, familles) => {
            if (!err) {
                await familles.forEach(async element => {
                    var listA = [];
                    var total=0;
                    var reductionT = [];
                    for(var j=0; j<element.enfant.length; j++){
                        var reduction = 0;
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        await ListActivite.findOne(({eleve: element.enfant[j], mois: moisActuel, annee: anneeActuel}),async (err, list) => {
                            if (!err) {
                                for (var i = 0; i < list.activite.length; i++) {
                                    var activ = list.activite[i];
                                    if (j > 0 && (activ.description === "Mensualite" || activ.description === "Inscription")) {
                                        if (j + 1 < 5) {
                                            reduction = ((j + 1) * 5) / 100;
                                        } else reduction = 0.2;
                                        total = total + activ.prix * (1 - reduction);
                                    } else {
                                        total = total + activ.prix * list.activiteQte[i];
                                    }
                                }
                                await new Promise(resolve => setTimeout(resolve, 500));
                                await listA.push(list);

                            } else console.log("Error to get listActiv findone : " + err);
                        });
                        reductionT.push(reduction);
                    }
                    await new Promise(resolve => setTimeout(resolve, 500));
                    await (countFact = countFact + 1);
                    await console.log("500" + countFact + " " + total);
                    await console.log(listA[0].eleve.nom);
                    const newFacture = new Facture({
                        idFact: countFact,
                        destinataire: element,
                        listActivite: listA,
                        paye: false,
                        reduction: reductionT,
                        total: total,
                        mois: moisActuel
                    }).save((err) => {
                        if (err) {
                            console.log('Erreur création nouvelles données :' + err);
                        }
                    });
                })
            }
            else console.log("Error to get data : " + err);
        });
    }


    var creationEnfantFamille = false;
    if (creationEnfantFamille) {

        var parents = [];
        await Eleve.find((err, eleves) => {
            if (!err) {
                eleves.forEach(async element => {
                    var parent = "" + element.parent1Nom + "," + element.parent1Prenom + "," + element.parent2Non + "," + element.parent2Prenom + "";
                    var w = {
                        parent1Nom: element.parent1Nom,
                        parent1Prenom : element.parent1Prenom,
                        parent2Nom : element.parent2Nom,
                        parent2Prenom : element.parent2Prenom
                    };
                    let e = await Eleve.find(w);
                    if (!parents.includes(parent)) {
                        const newFamille = new Famille({
                            parent1Nom: element.parent1Nom,
                            parent1Prenom: element.parent1Prenom,
                            parent2Nom: element.parent2Nom,
                            parent2Prenom: element.parent2Prenom,
                            enfant: e
                        }).save((err) => {
                            if (err) {
                                console.log('Erreur création nouvelles données :' + err);
                            }
                        });
                        parents.push(parent);

                    }
                })
            }
            else console.log("Error to get data : " + err);
        });

    }
    res.render("accueil");
});

mongoose.set('useFindAndModify', false);

app.use(bodyParser.json());

app.listen(PORT, () => {console.log("Serveur à l'écoute : http://localhost:" + PORT + "/home")});