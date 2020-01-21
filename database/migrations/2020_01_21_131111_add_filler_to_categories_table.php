<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddFillerToCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            //
        });

        DB::table('categories')->insert(
            [ 
                ["name" => "horror", "created_at" => NOW(), "updated_at" => NOW()], 
                ["name" => "scifi", "created_at" => NOW(), "updated_at" => NOW()], 
                ["name" => "drama", "created_at" => NOW(), "updated_at" => NOW()],
                ["name" => "action", "created_at" => NOW(), "updated_at" => NOW()],
                ["name" => "adventure", "created_at" => NOW(), "updated_at" => NOW()],
                ["name" => "animation", "created_at" => NOW(), "updated_at" => NOW()],
                ["name" => "action", "created_at" => NOW(), "updated_at" => NOW()],
            ]
        );
        
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            //
        });
    }
}
