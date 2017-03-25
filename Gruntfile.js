module.exports = function (grunt)
{

	require('time-grunt')(grunt);

	grunt.config.init({
		dir: {
			assets: 'assets',
			dist: 'dist',
			resources: 'resources'
		},

		url: {
			content: '/content',
			themes: '<%= url.content %>/themes',
			theme: '<%= url.themes %>/<%= theme %>'
		},

		js: {
			plugins: [
				'<%= dir.assets %>/**/*.js'
			]
		},

		jshint: {
			plugins: '<%= js.plugins %>',
			gruntfile: 'Gruntfile.js'
		},

		uglify: {
			options: {
				preserveComments: false
			},
			plugins: {
				files: [
					{
						expand: true,
						cwd: '<%= dir.assets %>/js',
						src: ['*.js', '!*.min.js'],
						dest: '<%= dir.dist %>/js',
						ext: '.min.js'
					}
				]
			},
			dist: {
				files: {
					'<%= dir.dist %>/js/general.min.js': [
						'<%= dir.assets %>/js/general/*.js',
						'!<%= dir.assets %>/js/general/*.min.js'
					],
					'<%= dir.dist %>/js/growl.min.js': [
						'<%= dir.assets %>/js/growl/*.js',
						'!<%= dir.assets %>/js/growl/*.min.js'
					],
					'<%= dir.dist %>/js/jquery-initialize.min.js': [
						'<%= dir.assets %>/js/jquery-initialize/*.js',
						'!<%= dir.assets %>/js/jquery-initialize/*.min.js'
					]
				}
			}
		},
		sass: {
			style: {
				files: [
					{
						expand: true,
						cwd: "<%= dir.assets %>/scss",
						src: ["**/*.scss"],
						dest: "<%= dir.dist %>/css",
						ext: '.min.css'
					}
				],
				options: {
					cleancss: true,
					outputStyle: 'compressed',
					//sourceComments: 'map',
					sourceMap: true
				}
			}
		},
		postcss: {
			css: {
				options: {
					map: true,
					processors: [
						require('autoprefixer')({browsers: ['last 5 versions', 'ie >= 9']}),
						require('csswring')
					]
				},
				src: "<%= dir.dist %>/css/**/*.css"
			},
			sass: {
				options: {
					syntax: require('postcss-scss'),
					processors: [
						require('postcss-sorting')(
							require('./.postcss-sorting.json')
						)
					]
				},
				src: "<%= dir.assets %>/scss/**/*.scss"
			}
		},
		csscomb: {
			options: {
				config: '.csscomb.json'
			},
			dynamic_mappings: {
				expand: true,
				cwd: '<%= dir.assets %>/scss/',
				src: ['**/*.scss'],
				dest: '<%= dir.assets %>/scss/',
				ext: '.scss'
			}
		},
		merge_media: {
			options: {
				compress: true
			},
			files: {
				src: "<%= dir.dist %>/css/style.min.css",
				dest: "<%= dir.dist %>/css/style.min.css"
			}
		},
		copy: {
			main: {
				files: [
					{
						expand: true,
						cwd: '<%= dir.assets %>/images',
						src: '**',
						dest: '<%= dir.dist %>/images/'
					}
				]
			}
		},
		watch: {
			options: {
				livereload: true
			},

			sass: {
				files: [
					'<%= dir.assets %>/scss/**/*.{scss,sass}',
					'<%= dir.assetsadmin %>/scss/**/*.{scss,sass}'
				],
				tasks: ['sass', 'postcss:css']
			},

			// JS Watches
			jsGrunfile: {
				files: 'Grunfile.js',
				tasks: ['jshint:gruntfile']
			},
			jsPlugins: {
				files: '<%= js.plugins %>',
				tasks: ['jshint:plugins', 'uglify']
			}
		}
	});

	grunt.registerTask('default',
		['csscomb', 'postcss:sass', 'sass', 'postcss:css', 'uglify', 'merge_media', 'copy', 'watch']);

	grunt.registerTask('optimize', ['postcss:sass', 'uglify']);

	grunt.registerTask('build', ['sass', 'postcss:css', 'merge_media', 'uglify', 'copy']);

	// Load all the npm tasks which starts with "grunt-"
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};
