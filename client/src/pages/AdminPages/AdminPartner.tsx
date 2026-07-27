import { api } from '../../api/api';
import AdminLogoBoard from './AdminLogoBoard';

export default function AdminPartner() {
  return (
    <AdminLogoBoard
      title="협력사 관리"
      description="메인 화면 PARTNERS 섹션에 노출되는 협력사를 관리합니다."
      itemLabel="협력사"
      fetchItems={api.getPartners}
      createItem={api.createPartner}
      updateItem={api.updatePartner}
      deleteItem={api.deletePartner}
    />
  );
}
