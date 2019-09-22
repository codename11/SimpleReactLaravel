        
@extends('layouts.app')

@section('content')

    <div class="flex-center position-ref full-height">
                
        <div class="content">
            <div class="title m-b-md">
                {{ config('app.name', 'Laravel') }}
            </div>

            <div id="karusel" class="carousel slide" data-ride="carousel">
                
                <div class="carousel-inner">
                    <div class="carousel-item active">
                    <img src="laravel.png" alt="Los Angeles" width="768" height="576">
                    <div class="carousel-caption">
                        <h3>Laravel</h3>
                        <p>Great way for doing backend</p>
                    </div>   
                    </div>
                    <div class="carousel-item">
                    <img src="react.png" alt="Chicago" width="768" height="576">
                    <div class="carousel-caption">
                        <h3>React</h3>
                        <p>Excellent frontend framework</p>
                    </div>   
                    </div>
                    <div class="carousel-item">
                    <img src="ajax.png" alt="New York" width="768" height="576">
                    <div class="carousel-caption">
                        <h3>Ajax</h3>
                        <p>Good for when you just can't wait for server response</p>
                    </div>   
                    </div>
                </div>
                
            </div>

            <div class="links">
                <a href="https://laravel.com/docs">Docs</a>
                <a href="https://laracasts.com">Laracasts</a>
                <a href="https://laravel-news.com">News</a>
                <a href="https://blog.laravel.com">Blog</a>
                <a href="https://nova.laravel.com">Nova</a>
                <a href="https://forge.laravel.com">Forge</a>
                <a href="https://vapor.laravel.com">Vapor</a>
                <a href="https://github.com/laravel/laravel">GitHub</a>
            </div>
        </div>
        
    </div>

@endsection