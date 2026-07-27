import { api } from '../../api/api';
import AdminLogoBoard from './AdminLogoBoard';

export default function AdminNetwork() {
  return (
    <AdminLogoBoard
      title="참여 대학 관리"
      description="메인 화면 NETWORK 섹션에 노출되는 대학·연합동아리를 관리합니다."
      itemLabel="참여 대학"
      showCategory
      showDarkBg
      fetchItems={api.getNetworks}
      createItem={api.createNetwork}
      updateItem={api.updateNetwork}
      deleteItem={api.deleteNetwork}
    />
  );
}
