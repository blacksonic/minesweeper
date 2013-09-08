define(['minesweeper/model/maze'], function(MazeModel) {
    var maze;

    describe('Maze model', function() {

        describe('generateFields', function() {
            it('should create 9 fields when size is 3', function() {
                maze = new MazeModel({size: 3});

                expect(maze.getFields().length).toEqual(9);
            });

            it('should create 2 fields in a row when size is 2', function() {
                maze = new MazeModel({size: 2});

                expect(maze.getField(0, 0)).toBeTruthy();
                expect(maze.getField(0, 1)).toBeTruthy();

                expect(maze.getField(0, 2)).toBeUndefined();
            });

            it('should create 2 fields in a column when size is 2', function() {
                maze = new MazeModel({size: 2});

                expect(maze.getField(0, 0)).toBeTruthy();
                expect(maze.getField(1, 0)).toBeTruthy();

                expect(maze.getField(2, 0)).toBeUndefined();
            });
        });

        describe('placeBombs', function() {
            it('should have 1 bomb field when given 1 bombs', function() {
                maze = new MazeModel({size: 3, bombs: 1});
                var fieldsWithBomb = maze.getFields().where({isBomb: true});

                expect(fieldsWithBomb.length).toEqual(1);
            });

            it('fields next to a bombed field should know the count of bombs in the vicinity', function() {
                spyOn(Math, 'random').andReturn(0);

                maze = new MazeModel({size: 3, bombs: 1});

                expect(maze.getField(1, 1).get('bombsNear')).toEqual(1);
                expect(maze.getField(0, 1).get('bombsNear')).toEqual(1);
                expect(maze.getField(1, 0).get('bombsNear')).toEqual(1);
            });
        });

        describe('getNeighbours', function() {
            it('should return existing neighbours of field', function() {
                maze = new MazeModel({size: 3, bombs: 1});

                var neighbours = maze.getNeighbours(maze.getField(0, 0));

                expect(neighbours.length).toEqual(3);

                expect(neighbours).toContain(maze.getField(0, 1));
                expect(neighbours).toContain(maze.getField(1, 0));
                expect(neighbours).toContain(maze.getField(1, 1));
            });

            it('should not return non existing neighbours', function() {
                maze = new MazeModel({size: 3, bombs: 1});

                var neighbours = maze.getNeighbours(maze.getField(0, 0));

                expect(neighbours).not.toContain(maze.getField(-1, -1));
            });
        });

        describe('display', function() {
            it('should reveal neighbour fields recursively when displayed field has no bombs near', function() {
                spyOn(Math, 'random').andReturn(0);

                maze = new MazeModel({size: 3, bombs: 1});

                maze.display(maze.getField(2, 2));

                expect(maze.getFields().where({isDisplayed: true}).length).toEqual(8);
            });

            it('should only return field itself when bomb(s) are near', function() {
                spyOn(Math, 'random').andReturn(0);

                maze = new MazeModel({size: 3, bombs: 1});

                maze.display(maze.getField(0, 1));

                expect(maze.getFields().where({isDisplayed: true}).length).toEqual(1);
            });
        });

        describe('getStatus', function() {
            it('should mark game as victory when all bombs are flagged and all fields are displayed', function() {
                maze = new MazeModel({size: 3, bombs: 1});

                maze.getFields().forEach(function(field) {
                    field.get('isBomb') ? field.flag() : field.display();
                });

                expect(maze.getStatus()).toEqual('victory');
            });

            it('should mark game as defeat when a bomb is displayed and not flagged', function() {
                spyOn(Math, 'random').andReturn(0);
                maze = new MazeModel({size: 3, bombs: 1});

                maze.getField(0, 0).display();

                expect(maze.getStatus()).toEqual('defeat');
            });

            it('should mark game as in progress when not all the fields are displayed', function() {
                spyOn(Math, 'random').andReturn(0);
                maze = new MazeModel({size: 3, bombs: 1});

                maze.getField(1, 1).display();

                expect(maze.getStatus()).toEqual('in_progress');
            });
        });

    });
});