        
@extends('layouts.app')

@section('content')
    <div class="container text-center">
                    
            <div class="content">
                <div class="title m-b-md">
                    {{ config('app.name', 'Laravel') }}
                </div>

                <div id="karusel" class="carousel slide" data-ride="carousel">
                    
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img class="img-fluid" src="laravel.png" alt="laravel">
                        <div class="carousel-caption">
                            <h3>Laravel</h3>
                            <p>Great way for doing backend</p>
                        </div>   
                        </div>
                        <div class="carousel-item">
                        <img class="img-fluid" src="react.png" alt="react">
                        <div class="carousel-caption">
                            <h3>React</h3>
                            <p>Excellent frontend framework</p>
                        </div>   
                        </div>
                        <div class="carousel-item">
                        <img class="img-fluid" src="ajax.png" alt="ajax">
                        <div class="carousel-caption">
                            <h3>Ajax</h3>
                            <p>Good for when you just can't wait for server response</p>
                        </div>   
                        </div>
                    </div>
                    
                </div>
                
            </div>
            
    </div>

@endsection