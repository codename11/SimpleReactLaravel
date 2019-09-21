<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/dashboard', 'DashboardController@dashboard');
Route::post('/dashboardInfo', 'DashboardController@ajaxInfo');

Route::post('/infoAjax','DashboardController@ajaxInfo');

Route::get('/create','VideoController@create');
Route::post('/upload','VideoController@store');

Route::get('/list','VideoController@list');
Route::post('/listData','VideoController@index');


