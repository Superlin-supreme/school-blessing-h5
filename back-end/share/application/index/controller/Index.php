<?php
namespace app\index\controller;
use app\index\exception\BaseException;
use think\Cache;
use think\Controller;
use app\index\model\User;
use app\index\model\Number;
use app\index\model\Comment;
use think\Db;
use think\Session;
use think\Validate;

class Index extends Controller
{
    public function register()
    {
        $post = input('post.');
        if (!array_key_exists('username',$post)){
            throw new BaseException([
                'msg' => '无用户名！'
            ]);
        }
        if (!array_key_exists('major',$post)){
            throw new BaseException([
                'msg' => '无专业！'
            ]);
        }
        $username = input('post.username');
        $major = input('post.major');
        $username = stripslashes($username);
        $major = stripslashes($major);
        $username = htmlspecialchars($username);
        $major = htmlspecialchars($major);
        $username = strip_tags($username);
        $major = strip_tags($major);
        if(!$username||!$major){
            throw new BaseException();
        }
        $User = new User();
        //查如果有就登录没有就注册
        $result = $User->where([
            'username' => $username,
            'major' => $major
        ])->field('id')->find();
        $token = '';
        if ($result){
            cache(md5('Quanta'.$result['id']), $result['id'], 7200);
            $token .= md5('Quanta'.$result['id']);
        }else{
            $number = new Number();
            //查出第几个送祝福的
            $count = $number->where('id','=',1)
                ->field('number')
                ->find();
            if (!$count) throw new BaseException();
            $new_number = (int)$count['number'] + 1;
            $User->startTrans();
            $number->startTrans();
            $rr = $User->data([
                'username' => $username,
                'major' => $major,
                'rank' => $new_number
            ])->save();
            $r = $number->where('id','=',1)
                ->update([
                    'number' => $new_number
                ]);
            if ($r&&$rr){
                $User->commit();
                $number->commit();
            }else{
                // 回滚事务
                $User->rollback();
                $number->rollback();
                throw new BaseException([
                    'msg' => '参数出错！'
                ]);
            }

            $rrr = $User->where([
                'username' => $username,
                'major' => $major
            ])->field('id')->find();
            cache(md5('Quanta'.$rrr['id']), $rrr['id'], 7200);
            $token .= md5('Quanta'.$rrr['id']);
            if(!$r||!$count||!$rr||!$rrr){
                throw new BaseException();
            }
        }
        return json([
            'code' => 200,
            'msg' => $token
        ]);
    }

    public function get_number(){
        $token = input('post.key');
        if (!Cache::get($token)){
            throw new BaseException([
                'code' => 403,
                'msg' => '非法请求！'
            ]);
        }
        $user = new User();
        $result = $user->where('id','=',Cache::get($token))
            ->field('rank')
            ->find();
        return json([
            'code' => 200,
            'msg' => $result['rank']
        ]);
    }

    public function get_comment_number(){
        $number = new Number();
        $result = $number->where('id','=',2)
            ->field('number')
            ->find();
        if (!$result) throw new BaseException();
        return json([
            'code' => 200,
            'msg' => $result['number']
        ]);
    }

    public function send_message(){
        $token = input('post.key');
        if (!Cache::get($token)){
            throw new BaseException([
                'code' => 403,
                'msg' => '非法请求！'
            ]);
        }
        $comment = input('post.comment');
        if (!$comment){
            throw new BaseException();
        }
        $comment = stripslashes($comment);
        $comment = htmlspecialchars($comment);
        $comment = strip_tags($comment);

        $content = file_get_contents("./static/a.txt");
        $content = mb_convert_encoding($content, 'utf-8', 'gbk');
        $contents= explode("\n",$content);//explode()函数以","为标识符进行拆分
        foreach ($contents as $v){
            $v =preg_replace("/[\r\n\s]/","",$v);
            if (preg_match('/'.$v.'/',$comment)){
                throw new BaseException([
                    'msg' => '请注意言辞！'
                ]);
            }
        }

//        date("Y-m-d H:i:s", time())
        $public_time = time();
        //查到评论数
        $number = new Number();
        $count = $number->where('id','=',2)
            ->field('number')
            ->find();
        if (!$count) throw new BaseException();
        $n = $count['number'];
        $n = (int)$n+1;
        $obj = new Comment();
        $obj->startTrans();
        $number->startTrans();
        $result = $obj->data([
            'user_id' => Cache::get($token),
            'value' => $comment,
            'time' => $public_time
        ])->save();
        $rrr = $number->where('id','=',2)
            ->update([
                'number' => $n
            ]);
        if ($rrr && $result){
            $obj->commit();
            $number->commit();
        }else{
            $obj->rollback();
            $number->rollback();
            throw new BaseException();
        }
        return json([
            'code' => 200,
            'msg' => '发布成功！'
        ]);
    }

    public function show_message(){
        $post = input('post.');
        if (!array_key_exists('page',$post)){
            throw new BaseException([
                'msg' => '无页号！'
            ]);
        }
        if (!array_key_exists('size',$post)){
            throw new BaseException([
                'msg' => '无页大小！'
            ]);
        }
        $rule = [
            'page'  => 'require|number',
            'size'   => 'require|number'
        ];
        $msg = [
            'page.require' => '页号不能为空',
            'page.number'   => '页号必须是数字',
            'size.require' => '页面大小不能为空',
            'size.number'   => '页面大小必须是数字',
        ];
        $validate = new Validate($rule,$msg);
        $result   = $validate->check($post);
        if(!$result){
            throw new BaseException([
                'msg' => $validate->getError()
            ]);
        }
        $page = (int)$post['page'];
        $size = (int)$post['size'];
        if ($page<1){
            throw new BaseException([
                'msg' => '页号最小为1'
            ]);
        }
        if ($size<1){
            throw new BaseException([
                'msg' => '页大小最小为1'
            ]);
        }
        $comment = new Comment();
        $start = ($page-1)*$size;
        $info = $comment->limit($start,$size)
            ->field('user_id,value,time')
            ->order([
                'time' => 'desc'
            ])
            ->select();
        if (!$info){
            throw new BaseException();
        }
        $user = new User();
        foreach ($info as $k => $v){
            $uid = $v['user_id'];
            $r = $user->where([
                'id' => $uid
            ])->field('username,major')->find();
            if (!$r) throw new BaseException();
            $v['name'] = $r['username'];
            $v['major'] = $r['major'];
            $new_time =  time() - (int)$v['time'];
            if ($new_time<60){
                $new_time = $new_time."秒前";
            }else{
                $m = floor($new_time/60);
                if ($m<60){
                    $new_time = $m."分钟前";
                }else{
                    $h = floor($m/60);
                    if ($h<60){
                        $new_time = $h."小时前";
                    }else{
                        $d = floor($h/24);
                        $new_time = $d."天前";
                    }
                }
            }
            $v['time'] = $new_time;
        }
        return json([
            'code' => 200,
            'msg' => $info
        ]);
    }
}
