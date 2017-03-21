Combo container - both frontend and api code
===============================================

[![Greenkeeper badge](https://badges.greenkeeper.io/starlightgroup/new-combo.svg?token=f2134c4e13d32419c296cad18c5bd8d5858901908a13de779937f34c32f13d56)](https://greenkeeper.io/)



Tunnable configuration parameters
===============================================

They are loaded from process environment and include

- `NODE_ENV`, default - `development`, or `production` - affects logging to stdout

- `HOST`, default - `0.0.0.0` - api listening on all available addresses

- `PORT`, default - 3000, api listens on 3000 port, like 95% expressJS applications

- `SECRET`, random string to make tampering sessions more hard

- `REDIS_URL` -  redis connection string, default is `redis://localhost:6379` - good idea to add protection to it - `redis://usernameIgnored:someRealyLongStringAsPassword@localhost:6379`
 
 
Build with docker
===============================================

``
  # docker build -t sl-combo .

``

