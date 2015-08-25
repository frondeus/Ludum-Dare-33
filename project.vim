let SessionLoad = 1
let s:so_save = &so | let s:siso_save = &siso | set so=0 siso=0
let v:this_session=expand("<sfile>:p")
silent only
cd /media/Code/LD33
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
set shortmess=aoO
badd +8 images/s_n_warrior.json
badd +7 images/s_p_warrior.json
badd +67 script/Unit.js
badd +10 script/Game.js
badd +118 script/Squad.js
argglobal
silent! argdel *
argadd images/ground.json
argadd images/projectiles.json
argadd images/s_n_archer.json
argadd images/s_n_defender.json
argadd images/s_n_king.json
argadd images/s_n_mount.json
argadd images/s_n_pikemen.json
argadd images/s_n_warrior.json
argadd images/s_p_archer.json
argadd images/s_p_defender.json
argadd images/s_p_king.json
argadd images/s_p_mount.json
argadd images/s_p_pikemen.json
argadd images/s_p_warrior.json
edit script/Unit.js
set splitbelow splitright
wincmd _ | wincmd |
split
1wincmd k
wincmd w
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
set nosplitbelow
set nosplitright
wincmd t
set winheight=1 winwidth=1
exe '1resize ' . ((&lines * 24 + 38) / 76)
exe '2resize ' . ((&lines * 49 + 38) / 76)
exe 'vert 2resize ' . ((&columns * 86 + 139) / 278)
exe '3resize ' . ((&lines * 49 + 38) / 76)
exe 'vert 3resize ' . ((&columns * 191 + 139) / 278)
argglobal
edit script/Unit.js
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=1
setlocal fml=1
setlocal fdn=20
setlocal nofen
let s:l = 12 - ((11 * winheight(0) + 12) / 24)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
12
normal! 04|
wincmd w
argglobal
edit script/Game.js
setlocal fdm=syntax
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=1
setlocal fml=1
setlocal fdn=20
setlocal fen
1
normal! zo
35
normal! zo
56
normal! zo
59
normal! zo
let s:l = 61 - ((25 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
61
normal! 031|
wincmd w
argglobal
edit images/s_p_warrior.json
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=1
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let s:l = 7 - ((6 * winheight(0) + 24) / 49)
if s:l < 1 | let s:l = 1 | endif
exe s:l
normal! zt
7
normal! 015|
wincmd w
2wincmd w
exe '1resize ' . ((&lines * 24 + 38) / 76)
exe '2resize ' . ((&lines * 49 + 38) / 76)
exe 'vert 2resize ' . ((&columns * 86 + 139) / 278)
exe '3resize ' . ((&lines * 49 + 38) / 76)
exe 'vert 3resize ' . ((&columns * 191 + 139) / 278)
tabnext 1
if exists('s:wipebuf') && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20 shortmess=filnxtToOc
let s:sx = expand("<sfile>:p:r")."x.vim"
if file_readable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &so = s:so_save | let &siso = s:siso_save
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
