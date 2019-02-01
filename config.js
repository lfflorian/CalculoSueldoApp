module.exports = {
    port: process.env.PORT || 3000,
    db: process.env.MONGODB || 'mongodb://lfflorian:admin123@ds115753.mlab.com:15753/calculosueldos',
    SECRET_TOKEN: 'PasswordForCalculoSueldosAplication'
}