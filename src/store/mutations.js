import {
record_dptchecklist,
record_empchecklist,
record_noticetitle,
record_noticewriter,
record_noticecontent,
record_entId,
record_token,
}from './mutation-types.js'

export default{
	[record_entId](state, info) {
		state.entId = info;
	},
	[record_token](state, info) {
		state.token = info;
	},
	// 保存选择的部门id
	[record_dptchecklist](state, info) {
		state.dptchecklist = info;
	},
	// 保存选择的人员id
	[record_empchecklist](state, info) {
		state.empchecklist = info;
	},
	// 保存公告标题
	[record_noticetitle](state, info) {
		state.noticetitle = info;
	},
	// 保存公告作者
	[record_noticewriter](state, info) {
		state.noticewriter = info;
	},
	// 保存公告内容
	[record_noticecontent](state, info) {
		state.noticecontent = info;
	},
}