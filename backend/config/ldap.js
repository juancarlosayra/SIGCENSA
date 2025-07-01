const ldap = require('ldapjs');

const LDAP_URL = process.env.LDAP_URL;             // ej. 'ldap://10.42.1.2:389'
const LDAP_DOMAIN = process.env.LDAP_DOMAIN;       // ej. 'censa.edu.cu'
const BASE_DN = process.env.LDAP_BASE_DN;          // ej. 'dc=censa,dc=edu,dc=cu'

async function authenticateAD(usuario, password) {
  const client = ldap.createClient({ url: LDAP_URL });

  const userPrincipalName = `${usuario}@${LDAP_DOMAIN}`;

  return new Promise((resolve, reject) => {
    client.bind(userPrincipalName, password, (err) => {
      if (err) {
        console.error('❌ Error al autenticar con LDAP:', err);
        return reject({ mensaje: 'Credenciales inválidas', error: err });
      }

      const searchOptions = {
        scope: 'sub',
        filter: `(sAMAccountName=${usuario})`,
        attributes: ['displayName', 'mail', 'sAMAccountName']
      };

      client.search(BASE_DN, searchOptions, (searchErr, res) => {
        if (searchErr) {
          console.error('❌ Error al buscar en LDAP:', searchErr);
          client.unbind();
          return reject({ mensaje: 'Error en búsqueda LDAP', error: searchErr });
        }

        let userEntry = null;

        res.on('searchEntry', (entry) => {
          userEntry = entry.object;
        });

        res.on('error', (resErr) => {
          console.error('❌ Error al procesar resultados LDAP:', resErr);
          client.unbind();
          return reject({ mensaje: 'Error procesando resultados LDAP', error: resErr });
        });

        res.on('end', () => {
          client.unbind();
          if (userEntry) {
            resolve({
              usuario: userEntry.sAMAccountName,
              displayName: userEntry.displayName,
              mail: userEntry.mail
            });
          } else {
            reject({ mensaje: 'Usuario no encontrado en LDAP' });
          }
        });
      });
    });
  });
}

module.exports = { authenticateAD };
 