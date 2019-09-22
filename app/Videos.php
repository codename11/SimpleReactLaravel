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

}
