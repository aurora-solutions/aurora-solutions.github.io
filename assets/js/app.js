angular.module('showcase', [])
    .controller('homeController', function($scope, $http, $q) {

        // Variables
        var organizations = [];
        $scope.repos = [];
        $scope.orgs = [];
        $scope.sortOrder = "";
        $scope.loading = true;


        // Client ID and Secret
        var client_id = '259040d36f1705356ca2',
            client_secret = '7fd53a577a524c39f917cf4d213171a9fdd17181';

        // Call to read local file repo links
        $http
            .get('repos.json')
            .then(function(organizations) {
                loadOrganizationsData(organizations.data);
                loadRepositoriesData(organizations.data);
            });

        //Loading Orgnaizations data for organizations listed in repos.json
        var loadOrganizationsData = function(organizationsList) {

            return $q.all(organizationsList.map(function(org) {
                return $http
                    .get('https://api.github.com/users/' + org.name + '?client_id=' + client_id + '&client_secret=' + client_secret)
                }))
                .then(function(results) {
                    results.forEach(function(organization) {
                        $scope.orgs = $scope.orgs.concat(organization.data);

                    });

                    $scope.loading = false;
                });

        }

        //Loading Repositories data for organizations listed in repos.json
        var loadRepositoriesData = function(organizationsList) {
            return $q.all(organizationsList.map(function(org) {
                    return $http
                        .get('https://api.github.com/users/' + org.name + '/repos?type=all&client_id=' + client_id + '&client_secret=' + client_secret)
                }))
                .then(function(results) {

                    results.forEach(function(organization, i) {

                        angular.forEach(organization.data, function(repo) {
                            if (organizationsList[i].repos.indexOf(repo.name.toLowerCase()) > -1) {
                                $scope.repos = $scope.repos.concat(repo);
                            }
                        });

                    });

                    $scope.loading = false;
                });
        }

    })