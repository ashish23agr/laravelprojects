<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrintsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('prints', function (Blueprint $table) {
            $table->id();
            $table->integer('shop_id');
			$table->unsignedBigInteger('setting_id');
			$table->foreign('setting_id')->references('id')->on('settings')->onDelete('cascade');
            $table->string('name');
			$table->string('short_code');
			$table->string('layer_content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('prints');
    }
}
