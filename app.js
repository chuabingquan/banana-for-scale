'use strict';

/**
 * Module Dependencies
*/
const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const compression = require('compression');
const enforce = require('express-sslify');
const path = require('path');

const app = express();

// enforce HTTPS in production environment
if (process.env.NODE_ENV === 'production') {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

// Gzip static resources for faster delivery.
app.use(compression());

app.use(logger('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running.');
});

app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // return error to client
    res.status(err.status || 500);
    res.json({ message: err.message });
});