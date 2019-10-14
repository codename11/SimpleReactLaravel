<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Subtitles extends Model
{
    protected $fillable = [
        'name',
        'user_id',
        "video_id",
    ];

    public function user(){
        return $this->belongsTo("App\User",'user_id');
    }

    public function video(){
        return $this->belongsTo("App\Videos",'video_id');
    }

}
