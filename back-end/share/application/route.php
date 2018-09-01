<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006~2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------
use think\Route;


Route::rule('login','index/Index/register','POST',['https' => false]);
Route::rule('number','index/Index/get_number','POST',['https' => false]);
Route::rule('send','index/Index/send_message','POST',['https' => false]);
Route::rule('count','index/Index/get_comment_number','GET',['https' => false]);
Route::rule('show','index/Index/show_message','POST',['https' => false]);
