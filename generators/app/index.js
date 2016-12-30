'use strict';
const yeoman = require('yeoman-generator');
const fs = require('fs-extra');
const path = require('path');
const _ = require('lodash');
const armadillo = require('gulp-armadillo/lib/helpers/armadillo');

module.exports = yeoman.Base.extend({

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    armadillo('Let\'s make a website!');

    var prompts = [
      {
        type: 'string',
        name: 'project',
        message: 'What\'s the name of your project?',
        validate: function (input) {
          if (input === '') {
            return 'Please enter a project name';
          }

          return true;
        }
      }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.appname = _.kebabCase(props.project);

      done();
    }.bind(this));
  },

  configuring: function () {
    if (path.basename(this.destinationPath()) !== this.appname) {
      armadillo('Making folder `' + this.appname + '` for you');

      fs.ensureDirSync(this.appname);
      this.destinationRoot(this.destinationPath(this.appname));
    }

    this.config.save();

    // Dotfiles
    this.fs.copy(
      this.templatePath('nvmrc'),
      this.destinationPath('.nvmrc')
    );

    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );

    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );

    this.fs.copy(
      this.templatePath('_travis.yml'),
      this.destinationPath('.travis.yml')
    );
  },

  writing: function () {
    const folders = [
      'images',
      'videos',
      'audio',
      'fonts',
      'documents'
    ];

    this.fs.copy(
      this.templatePath('Gulpfile.js'),
      this.destinationPath('Gulpfile.js')
    );

    this.fs.copy(
      this.templatePath('config.js'),
      this.destinationPath('config/default.js')
    );

    this.fs.copy(
      this.templatePath('pages'),
      this.destinationPath('pages')
    );

    this.fs.copy(
      this.templatePath('_index.html'),
      this.destinationPath('templates/_index.html')
    );

    this.fs.copy(
      this.templatePath('sass'),
      this.destinationPath('sass')
    );

    this.fs.copy(
      this.templatePath('main.js'),
      this.destinationPath('js/main.js')
    );

    // Folders
    folders.forEach(folder => {
      this.fs.copy(
        this.templatePath('gitkeep'),
        this.destinationPath(`${folder}/.gitkeep`)
      );
    });
  },

  install: function () {
    this.installDependencies();
  }
});
