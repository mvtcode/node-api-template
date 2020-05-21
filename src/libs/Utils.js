/**
 * Created by tanmv on 27/05/2018.
 */

'use strict';

import moment from 'moment';
import config from '../../config';
import {sha256} from '../libs/Encript';

const patent_random_string = '0123456789abcdefghijklmnopqrstuvwxyz';
const patent_random_string_length = patent_random_string.length;

export const getPassword = (password) => {
	return sha256(`${config.password_prefix}-${password}`);
};

export const hidenEmail = (s, char = '*') => {
	if(s) {
		const n = s.indexOf('@');
		if(n > 0) {
			const s1 = s.substring(0, n);
			const s2 = s.substring(n);
			const length = s1.length;
			let s11 = s1.substring(0, Math.round(length / 2));
			for(let i = Math.round(length / 2); i < length; i++) {
				s11 += char;
			}
			return s11 + s2;
		} else {
			return s;
		}
	}
	return null;
};

export const getNameFromEmail = (s) => {
	if(s && typeof s === 'string') {
		return s.split('@')[0];
	}
	return null;
};

export const getNameFromMobile = (s) => {
	if(s && typeof s === 'string') {
		const len = s.length;
		return s.substring(3) + s.substring(len - 4, len - 1);
	}
	return null;
};

export const makeRewrite = (str) => {
	if(!str) return str;
	str= str.trim().toLowerCase();
	str= str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str= str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str= str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str= str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str= str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str= str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str= str.replace(/đ/g,"d");
	/* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
	str= str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g,"-");
	//thay thế 2- thành 1-
	str= str.replace(/-+-/g,"-");
	//cắt bỏ ký tự - ở đầu và cuối chuỗi
	str= str.replace(/^\-+|\-+$/g,"");
	return str;
};

export const formatDate = (date, format = 'DD/MM/YYYY') => {
	return moment(date).format(format);
};

export const randomString = (n) => {
	let s = '';
	for(let i=0;i<n;i++){
		s += patent_random_string[Math.floor(Math.random()*patent_random_string_length)];
	}
	return s;
};

export const randomInt = (min, max) => {
	return Math.floor(Math.random()*(max-min+1)+min);
};

export const randomNumber = (n) => {
	const patent = '0123456789';
	const patent_length = patent.length;
	let s = '';
	for(let i=0;i<n;i++){
		s += patent[Math.floor(Math.random()*patent_length)];
	}
	return s;
};

export const randomArray = (arr, n) => {
	if (n <= arr.length) {
		let arr_index = [];
		let clone = arr.slice();
		for (let i = 0; i < n; i++) {
			let index = Math.floor(Math.random() * clone.length);
			arr_index.push(clone[index]);
			clone.splice(index, 1);
		}
		return arr_index;
	}
	else {
		console.log('Random array: n not greate than length array!');
		return null;
	}
};

export const random2Array = (arr, arr2, n) => {
	if(arr && arr2){
		if (n <= arr.length) {
			let arr_1 = [];
			let arr_2 = [];
			let clone1 = arr.slice();
			let clone2 = arr2.slice();
			for (let i = 0; i < n; i++) {
				let index = Math.floor(Math.random() * clone1.length);

				arr_1.push(clone1[index]);
				arr_2.push(clone2[index]);

				clone1.splice(index, 1);
				clone2.splice(index, 1);
			}
			return [arr_1, arr_2];
		}
		else {
			return null;
		}
	}
	else{
		return null;
	}
};

export const GenPageHtml = ($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow) => {
	let $numberpage = 0;
	if ($totalrecord % $irecordofpage == 0)
		$numberpage = Math.floor($totalrecord / $irecordofpage);
	else
		$numberpage = Math.floor($totalrecord / $irecordofpage) + 1;

	if ($numberpage == 1)
		return "";

	let $loopend = 0;
	let $loopstart = 0;
	let $istart = false;
	let $iend = false;
	if ($pageindex == 0)
	{
		$loopstart = 0;
		$loopend = $numberpage > ($rshow - 1) ? $rshow : $numberpage;
		if ($numberpage > $rshow)
			$iend = true;
	}
	else
	{
		if ($pageindex < $numberpage - ($rshow - 1) && $pageindex != 0)
		{
			$loopstart = $pageindex - 1;
			$loopend = $pageindex + ($rshow - 1);
			$iend = true;
			if ($pageindex > 1)
				$istart = true;
		}
		else
		{
			if ($numberpage - $rshow > 0)
			{
				$loopstart = $numberpage - $rshow;
				$istart = true;
				$loopend = $numberpage;
			}
			else
			{
				$loopstart = 0;
				$loopend = $numberpage;
			}
		}
	}

	let $sPage = '<ul class="'+ $className +'">';
	if ($istart)
		$sPage += '<li><a href="?trang=0">&lt;&lt;</a></li>';
	if ($pageindex >= 1)
		$sPage += '<li><a href="?trang=' + ($pageindex - 1) + '">&lt;</a></li>';
	for (let $i = $loopstart; $i < $loopend; $i++)
	{
		if ($pageindex == $i)
			$sPage += '<li class="' + $classActive + '"><a href="javascript:void(0);">';
		else
			$sPage += '<li><a href="?trang=' + $i + '">';
		$sPage += ($i+1) + '</a></li>';
	}
	if ($pageindex <= $numberpage - 2)
		$sPage += '<li><a href="?trang=' + ($pageindex + 1) + '">&gt;</a></li>';
	if ($iend)
		$sPage += '<li><a href="?trang=' + ($numberpage - 1) + '">&gt;&gt;</a></li>';
	$sPage += '</ul>';

	return $sPage;
};

export const GenPageHtmlNews = ($totalrecord,$irecordofpage,$pageindex,$className,$classActive,$rshow,$function_name,$prefix) => {
	let $numberpage = 0;
	if ($totalrecord % $irecordofpage == 0)
		$numberpage = Math.floor($totalrecord / $irecordofpage);
	else
		$numberpage = Math.floor($totalrecord / $irecordofpage) + 1;

	if ($numberpage == 1)
		return "";

	let $loopend = 0;
	let $loopstart = 0;
	let $istart = false;
	let $iend = false;
	if ($pageindex == 0)
	{
		$loopstart = 0;
		$loopend = $numberpage > ($rshow - 1) ? $rshow : $numberpage;
		if ($numberpage > $rshow)
			$iend = true;
	}
	else
	{
		if ($pageindex < $numberpage - ($rshow - 1) && $pageindex != 0)
		{
			$loopstart = $pageindex - 1;
			$loopend = $pageindex + ($rshow - 1);
			$iend = true;
			if ($pageindex > 1)
				$istart = true;
		}
		else
		{
			if ($numberpage - $rshow > 0)
			{
				$loopstart = $numberpage - $rshow;
				$istart = true;
				$loopend = $numberpage;
			}
			else
			{
				$loopstart = 0;
				$loopend = $numberpage;
			}
		}
	}

	let $sPage = '<ul class="'+ $className +'">';
	if ($istart)
		$sPage += '<li><a onclick="javascript:' + $function_name + '(0)" href="'+$prefix+'/?trang=0"><i class="fa fa-fast-backward"></i></a></li>';
	if ($pageindex >= 1)
		$sPage += '<li><a onclick="javascript:' + $function_name + '(' + ($pageindex - 1) + ')" href="'+$prefix+'/?trang='+($pageindex - 1)+'"><i class="fa fa-step-backward"></i></a></li>';
	for (let $i = $loopstart; $i < $loopend; $i++)
	{
		if ($pageindex == $i)
			$sPage += '<li><a class="' + $classActive + '" href="javascript:void(0);">';
		else
			$sPage += '<li><a onclick="javascript:' + $function_name + '(' + $i + ')" href="'+$prefix+'/?trang='+$i+'">';
		$sPage += ($i+1) + '</a></li>';
	}
	if ($pageindex <= $numberpage - 2)
		$sPage += '<li><a onclick="javascript:' + $function_name + '(' + ($pageindex + 1) + ')" href="'+$prefix+'/?trang='+($pageindex + 1)+'" ><i class="fa fa-step-forward"></i></a></li>';
	if ($iend)
		$sPage += '<li><a onclick="javascript:' + $function_name + '(' + ($numberpage - 1) + ')" href="'+$prefix+'/?trang='+($numberpage - 1)+'" ><i class="fa fa-fast-forward"></i></a></li>';
	$sPage += '</ul>';

	return $sPage;
};
