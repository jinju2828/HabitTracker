3/15 bugs

1. 모바일로 가면 input daily goal, user name 사라짐
: 왜냐하면 local storage에 저장되서 그럼. 이거 db에 저장해야 함

2. complete mark를 하면 마크가 되면서 계속 숫자가 추가되는데, 페이지 리프레시를 하면 마크된게 사라짐 (text grey out). 그리고 또 마크하면 complete task숫자가 계속 늘어남. localhost에서는 문제 없음.

3. 그리고 해빗이 없을 경우에는 input daily 골 컴포넌트를 안보여줘야 함.