define(['marionette', '../view/maze'], function (Marionette, MazeView) {
    return function(application) {
        application.module('Game', function(Game, Minesweeper, Backbone, Marionette, $, _) {
            var fields = application.request('maze:generateFields', 6, 10);

            var maze = new MazeView({collection: fields});

            Minesweeper.mainRegion.show(maze);
        });
    };
});
