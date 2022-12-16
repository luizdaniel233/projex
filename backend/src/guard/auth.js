const jwt = require('jsonwebtoken');

class Verify{ 
    
    verifyJWT(req, res, next){
        
        let remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
                req.connection.remoteAddress || // Recupera o endereço remoto da chamada
                req.socket.remoteAddress || // Recupera o endereço através do socket TCP
                req.connection.socket.remoteAddress // Recupera o endereço através do socket da conexão
        
        //console.log(req)
        let token = `${req.headers['authorization']}`;
        token = token.replace('Bearer ','')
        if (!token) {
            const output = { "ip": remoteIp,auth: false, message: 'Não ha token.' }
            console.log(output)
            return res.status(401).json(output);
        }
        

        jwt.verify(token, process.env.secret,{algorithm: ["HS256"]}, function(err, decoded) {
        if (err){
            const output = { "ip": remoteIp,auth: false, message: 'Falha para autenticar o token.' }
            console.log(output)
            return res.status(401).json(output);
        } 

        // se tudo estiver ok, salva no request para uso posterior
        req.userId = decoded.id;
        next();
        });
    }


}

module.exports = new Verify()
