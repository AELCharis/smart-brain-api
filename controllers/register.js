

const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
       return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {  //xrisimopio to trx object gia na mou kani aftes tis litourgies
        trx.insert({  //xrisimopio trnasaction otan exo na kano perisotera apo ena pragamata mazi
            email: email,
        })
            .into('login') //to ekana insert sto login
            .returning('email') //epestrepsa to email
            .then(loginemail => { // k meta xrisimopio to login email
                return trx('users') //gia na epistrepsi akoma mia trx transaction
                    .returning('*')
                    .insert({  //gia na kani insert mesa sto table me tous users
                        email: loginemail[0],
                        name: name,
                        joined: new Date()
                    }).then(user =>{
                        res.json(user[0]); //apantisi piso me json
                    })
            })
            .then(trx.commit)  //gia na ekelestoun ola ta pio pano prepi na kano commit
            .catch(trx.rollback)  //ean den petixoun ta pio pano kani rollback eki pou itan
    })

        .catch(err => res.status(400).json('Unable to Register'));
}

module.exports = {
    handleRegister : handleRegister
};