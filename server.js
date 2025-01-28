const morgan = require('morgan');
const app = require('./src/app');

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.send('Welcome to the Microsoft Azure Blob Storage API');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});