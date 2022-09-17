const jwt = require('jsonwebtoken');

const generatorToken = (uid) => {
	return new Promise((resolve, reject) => {
		const payload = {uid};
			
		// Register the JWT singature
		jwt.sign(payload, process.env.SECRET_JWT_SEED, {
			expiresIn: '1h',			
		}, (err,token) => {
			(err)
				? reject('Error! It is not generate the token')
				: resolve(token)
		});
	});
};

module.exports = {
  generatorToken, 
}