const NIVELES_ROL = {
    guest: 1,
    user: 2,
    admin: 3
};

function nivelDe(rol) {

    return NIVELES_ROL[rol] || 0;

}

function esNivelIgualOInferior(rolQuienAsigna, rolDestino) {

    return nivelDe(rolDestino) <= nivelDe(rolQuienAsigna);

}

module.exports = {
    NIVELES_ROL,
    nivelDe,
    esNivelIgualOInferior
};