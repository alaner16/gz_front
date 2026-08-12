let tema = localStorage.getItem('tema') || false
let service = {}
service.actualizarTema = function(theme){
    tema = theme
    localStorage.setItem('tema', theme)
}
service.getTema = function(){

    return tema
}

export default service
