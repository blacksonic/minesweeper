define(['marionette', './module/mazegenerator', './module/game'], function (Marionette, mazeGeneratorModule, gameModule) {
    var application = new Marionette.Application();

    application.addRegions({
        mainRegion: '#main-region'
    });

    mazeGeneratorModule(application);
    gameModule(application);

    return application;
});