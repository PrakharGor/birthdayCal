var app = angular.module('calApp', []);
app.controller('calCtrl', function($scope) {
    $scope.init = function() {
        $scope.jsonInput = [{
                name: "Tyrion Lannister",
                birthday: "12/02/1978"
            }, {
                name: "Cersei Lannister",
                birthday: "11/30/1975"
            }, {
                name: "Daenerys Targaryen",
                birthday: "11/24/1991"
            }, {
                name: "Arya Stark",
                birthday: "11/25/1996"
            }, {
                name: "Jon Snow",
                birthday: "12/03/1989"
            }, {
                name: "Sansa Stark",
                birthday: "10/08/1992"
            }, {
                name: "Jorah Mormont",
                birthday: "12/16/1968"
            }, {
                name: "Jaime Lannister",
                birthday: "12/06/1975"
            }, {
                name: "Sandor Clegane",
                birthday: "11/07/1969"
            }, {
                name: "Tywin Lannister",
                birthday: "10/12/1951"
            }, {
                name: "Theon Greyjoy",
                birthday: "12/31/1989"
            }, {
                name: "Samwell Tarly",
                birthday: "12/07/1990"
            }, {
                name: "Joffrey Baratheon",
                birthday: "06/12/1992"
            }, {
                name: "Catelyn Stark",
                birthday: "12/03/1962"
            }, {
                name: "Bran Stark",
                birthday: "12/02/1995"
            }, {
                name: "Petyr Baelish",
                birthday: "11/20/1974"
            }, {
                name: "Robb Stark",
                birthday: "11/28/1986"
            }, {
                name: "Brienne of Tarth",
                birthday: "11/27/1985"
            }, {
                name: "Margaery Tyrell",
                birthday: "12/02/1989"
            }, {
                name: "Stannis Baratheon",
                birthday: "09/14/1971"
            }, {
                name: "Davos Seaworth",
                birthday: "02/13/1973"
            }, {
                name: "Tormund Giantsbane",
                birthday: "12/14/1974"
            }, {
                name: "Jeor Mormont",
                birthday: "11/01/1955"
            }, {
                name: "Eddard Stark",
                birthday: "12/02/1963"
            }, {
                name: "Khal Drogo",
                birthday: "12/05/1980"
            }, {
                name: "Ramsay Bolton",
                birthday: "12/05/1976"
            }, {
                name: "Robert Baratheon",
                birthday: "12/02/1965"
            }, {
                name: "Daario Naharis",
                birthday: "12/02/1985"
            }, {
                name: "Viserys Targaryen",
                birthday: "12/06/1984"
            }];
        //set Initials and birthdate as date objs
        angular.forEach($scope.jsonInput, function(value, key) {
            $scope.jsonInput[key].initials = getInitials(value.name);// value.name.replace(/\W*(\w)\w*/g, '$1').toUpperCase();
            $scope.jsonInput[key].birthday = new Date(value.birthday);
        });
        $scope.jsonInput = sortByBirthday($scope.jsonInput);
        $scope.initWeekDays();
    };
//    create/reset week Days Object to  set the cards
    $scope.initWeekDays = function() {
        $scope.weekDays = [{'day': 'Sunday', 'initials': []},
            {'day': 'Monday', 'initials': []},
            {'day': 'Tuesday', 'initials': []},
            {'day': 'Wednesday', 'initials': []},
            {'day': 'Thursday', 'initials': []},
            {'day': 'Friday', 'initials': []},
            {'day': 'Saturday', 'initials': []}];
        $scope.setGridClass();
    };
    //set the day cards after year is entered
    $scope.setCards = function() {
        if (this.inputYear.toString().length === 4)
        {
            $scope.initWeekDays();
            $scope.setDayFromInputYear();
            $scope.groupByDays();
            $scope.setGridClass();
        }
    };
//    Sets day for given birthdate as per input Year
    $scope.setDayFromInputYear = function() {
        angular.forEach(this.jsonInput, function(value, key) {
            $scope.jsonInput[key].day = getDayForGivenYear(value.birthday);
        });
    };

    $scope.groupByDays = function() {
        angular.forEach($scope.jsonInput, function(value, key) {
            var singWeekDay = setSingWeekObj(value.name, value.initials, value.birthday);
            insertWeekDayObj(singWeekDay, value.day);
        });
    };
//    set class of card grid on basis of no. ppl present
    $scope.setGridClass = function() {
        angular.forEach($scope.weekDays, function(value, key) {
            var length = value.initials.length;
            if (length === 0)
                $scope.weekDays[key].className = "day--empty";
            else if (length === 1)
                $scope.weekDays[key].className = "";
            else if (length < 5)
                $scope.weekDays[key].className = "four";
            else if (length < 10)
                $scope.weekDays[key].className = "nine";
            else
                $scope.weekDays[key].className = "sixteen";
        });
    };
//    Add new user
    $scope.addCharacter = function() {
        if (this.characterName !== "" && this.characterBirthday)
        {
            var newChar = {'name': this.characterName, 'birthday': this.characterBirthday};
            newChar.initials = getInitials(newChar.name);            
            newChar.day = getDayForGivenYear(newChar.birthday);
//            push object in jsonInput
            $scope.jsonInput.push(newChar);
            if ($scope.inputYear)
            {
//            create a weekDay object and push it into respective day card array
                var singWeekDay = setSingWeekObj(newChar.name, newChar.initials, newChar.birthday);
                insertWeekDayObj(singWeekDay, newChar.day);
                sortByBirthday($scope.weekDays[newChar.day].initials);
                $scope.setGridClass();
            }
        }
    };
    var getInitials = function(name) {
        return name.replace(/\W*(\w)\w*/g, '$1').toUpperCase();
    };
    var sortByBirthday = function(array) {
        array.sort(function(a, b) {
            return new Date(b.birthday) - new Date(a.birthday);
        });
        return array;
    };
    var getDayForGivenYear = function(birthdate) {
        if ($scope.inputYear)
        {
            return (new Date((birthdate.getMonth() + 1) + '/'
                    + birthdate.getDate() + '/'
                    + $scope.inputYear.toString())).getDay();
        }
        return;
    };

    var setSingWeekObj = function(name, initials, birthday) {
        return {'name': name, 'initials': initials,
            'birthday': birthday};
    };
    var insertWeekDayObj = function(singWeekDay, day) {
        var currentVal = $scope.weekDays[day].initials;
        currentVal.push(singWeekDay);
        $scope.weekDays[day].initials = currentVal;
    };
});