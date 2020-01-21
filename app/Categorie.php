<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $fillable = [
        'name'
    ];

    public function videos(){
        return $this->hasMany("App\Videos","id");
    }

}
