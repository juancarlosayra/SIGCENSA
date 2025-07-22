const ldap = require( 'ldapjs' );
const { config } = require( 'dotenv' );

function authenticate( username, password, callback ) {
    const client = ldap.createClient( {
        url: process.env.LDAP_URL,
           } );
    const userDN = 'cn=${ username },cn=users,${ process.env.LDAP_BASE }';

    client.bind( userDN, password, ( err ) => {
        if ( err ) {
            callback( err.message, false );
        } else {
            callback( 'Autenticacion exitosa', true );
        }
        client.unbind();
    });
}

module.exports = { authenticate };