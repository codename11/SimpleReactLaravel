<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Videos extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        "title",
        "thumbnail",
        "description",
    ];

    public function user(){
        return $this->belongsTo("App\User",'user_id');
    }

    public function prev($video)
    {
        if($video->orderBy('id', 'ASC')->where('id', '>', $video->id)->first()){
            $prev = $video->orderBy('id', 'ASC')->where('id', '>', $video->id)->first()->id;
        }
        else{
            $prev = $video->min('id');
        }
        
        return $prev;
    } 

    public function next($video)
    {
        if($video->orderBy('id', 'DESC')->where('id', '<', $video->id)->first()){
            $next = $video->orderBy('id', 'DESC')->where('id', '<', $video->id)->first()->id;
        }
        else{
            $next = $video->max('id');
        }
        
        return $next;
    } 

}
