require(["jquery", "models"], function($, models) {
    $(function() {
        //$('body').alpha().beta();
        //models.testModelLogger();
        var song = new models.Song({id:'Creep-Radiohead'});
        song.fetch();
        console.log(song);
    });
});